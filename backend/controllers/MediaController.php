<?php

declare(strict_types=1);

class MediaController
{
    /**
     * Return a relative URL path for a file.
     * Stored file_path is already relative: e.g. "uploads/packages/file.jpg"
     * We expose it as "/backend/uploads/packages/file.jpg" so the frontend
     * can prepend its own origin and it works both locally and on production.
     */
    private function relativeUrl(string $filePath): string
    {
        // Normalise: strip any absolute URL prefix that may have been stored
        // previously (e.g. "http://localhost:8000/uploads/…" → "uploads/…")
        $filePath = preg_replace('#^https?://[^/]+/#', '', $filePath);
        $filePath = ltrim($filePath, '/');

        return '/backend/' . $filePath;
    }

    public function index(): void
    {
        AuthMiddleware::handle();
        $items = (new MediaModel())->all();
        foreach ($items as &$item) {
            $item['url'] = $this->relativeUrl($item['file_path']);
        }
        Response::success($items);
    }

    public function upload(): void
    {
        AuthMiddleware::handle();

        if (empty($_FILES['file'])) {
            Response::error('No file uploaded.', 400);
        }

        $file        = $_FILES['file'];
        $allowedMime = ['image/jpeg', 'image/png', 'image/webp'];
        $maxSize     = (int) Env::get('UPLOAD_MAX_SIZE', 5242880);

        if ($file['error'] !== UPLOAD_ERR_OK) {
            Response::error('File upload error.', 400);
        }
        if (!in_array($file['type'], $allowedMime, true)) {
            Response::error('Invalid file type. Allowed: jpg, png, webp.', 422);
        }
        if ($file['size'] > $maxSize) {
            Response::error('File too large. Max 5MB.', 422);
        }

        $allowedFolders = ['packages', 'hotels', 'destinations', 'media'];
        $folder         = $_POST['type'] ?? 'media';
        if (!in_array($folder, $allowedFolders, true)) {
            $folder = 'media';
        }

        $ext      = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $filename = uniqid('', true) . '_' . time() . '.' . $ext;
        $basePath = __DIR__ . '/../' . Env::get('UPLOAD_PATH', 'uploads') . '/' . $folder;

        if (!is_dir($basePath)) {
            mkdir($basePath, 0755, true);
        }

        $destPath = $basePath . '/' . $filename;
        if (!move_uploaded_file($file['tmp_name'], $destPath)) {
            Response::error('Failed to save file.', 500);
        }

        // Always store a clean relative path — no hostname, no prefix
        $filePath = Env::get('UPLOAD_PATH', 'uploads') . '/' . $folder . '/' . $filename;

        $model  = new MediaModel();
        $id     = $model->create([
            'filename'      => $filename,
            'original_name' => $file['name'],
            'file_path'     => $filePath,
            'file_size'     => $file['size'],
            'mime_type'     => $file['type'],
        ]);

        $record        = $model->findById($id);
        $record['url'] = $this->relativeUrl($filePath);

        Response::success($record, 'File uploaded.', 201);
    }

    public function destroy(int $id): void
    {
        AuthMiddleware::handle();
        $model  = new MediaModel();
        $record = $model->findById($id);
        if (!$record) {
            Response::notFound('Media not found.');
        }

        // Strip any absolute URL prefix before resolving the physical path
        $cleanPath = preg_replace('#^https?://[^/]+/#', '', $record['file_path']);
        $cleanPath = ltrim($cleanPath, '/');
        // Strip leading "backend/" if somehow stored that way
        $cleanPath = preg_replace('#^backend/#', '', $cleanPath);

        $fullPath = __DIR__ . '/../' . $cleanPath;
        if (file_exists($fullPath)) {
            unlink($fullPath);
        }
        $model->delete($id);
        Response::success(null, 'Media deleted.');
    }
}
