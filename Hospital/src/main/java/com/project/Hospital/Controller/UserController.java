package com.project.Hospital.Controller;

import com.project.Hospital.Model.User;
import com.project.Hospital.Repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;

    // ✅ Constructor injection
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ---------------- GET ALL USERS ----------------
    @GetMapping("/getAll")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ---------------- UPDATE USER / ADMIN ----------------
    @PutMapping("/update/{id}")
    public User updateUser(@PathVariable String id, @RequestBody User user) {

        User existing = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        existing.setName(user.getName());
        existing.setEmail(user.getEmail());
        existing.setMobile(user.getMobile());
        existing.setAge(user.getAge());
        existing.setRole(user.getRole());

        return userRepository.save(existing);
    }

    // ---------------- DELETE USER / ADMIN ----------------
    @DeleteMapping("/delete/{id}")
    public void deleteUser(@PathVariable String id) {
        userRepository.deleteById(id);
    }
}
