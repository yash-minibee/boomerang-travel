<?php

declare(strict_types=1);

class MediaController
{
    public function index(): void
    {
        AuthMiddleware::handle();
        $items  = (new MediaModel())->all();
        $appUrl = rtrim(Env::get('APP_URL', ''), '/');
        foreach ($items as &$item) {
            $item['url'] = $appUrl . '/' . $item['file_path'];
        }
        Response::success($items);
    }

    public function upload(): void
    {
        AuthMiddleware::handle();

        if (empty($_FILES['file'])) {
            Response::error('No file uploaded.', 400);
        }

        $file       = $_FILES['file'];
        $allowedMime = ['image/jpeg', 'image/png', 'image/webp'];
        $maxSize    = (int) Env::get('UPLOAD_MAX_SIZE', 5242880);

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

        $filePath  = Env::get('UPLOAD_PATH', 'uploads') . '/' . $folder . '/' . $filename;
        $model     = new MediaModel();
        $id        = $model->create([
            'filename'      => $filename,
            'original_name' => $file['name'],
            'file_path'     => $filePath,
            'file_size'     => $file['size'],
            'mime_type'     => $file['type'],
        ]);

        $record       = $model->findById($id);
        $appUrl       = rtrim(Env::get('APP_URL', ''), '/');
        $record['url'] = $appUrl . '/' . $filePath;

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
        $fullPath = __DIR__ . '/../' . $record['file_path'];
        if (file_exists($fullPath)) {
            unlink($fullPath);
        }
        $model->delete($id);
        Response::success(null, 'Media deleted.');
    }
}
