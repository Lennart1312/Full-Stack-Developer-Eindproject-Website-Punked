package net.punked.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    @PostMapping
    public String uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        String uploadDir = "uploads/";
        Path path = Paths.get(uploadDir + file.getOriginalFilename());
        Files.createDirectories(path.getParent());
        Files.write(path, file.getBytes());
        return "/uploads/" + file.getOriginalFilename();
    }
}
