package com.project.Hospital.Controller;
import com.project.Hospital.Model.User;
import com.project.Hospital.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate; import java.util.*;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AttendanceController {
    @Autowired
    private UserRepository userRepository;

    // ---------------- Mark Attendance ---------------- \
    @PostMapping("/attendance/{userId}")
    public ResponseEntity<Map<String, Object>> markAttendance(@PathVariable String userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(404)
                    .body(Map.of("status", 404, "message", "User not found"));
        }

        User user = optionalUser.get();
        String today = LocalDate.now().toString();

        if (user.getAttendance().contains(today)) {
            return ResponseEntity.status(400)
                    .body(Map.of("status", 400, "message", "Attendance already marked for today"));
        }

        user.addAttendance(today);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("status", 200, "message", "Attendance marked for " + today));
    }


    // ---------------- Get Attendance for a User ----------------
    @GetMapping("/attendance/{userId}")
    public ResponseEntity<List<String>> getAttendance( @PathVariable String userId, @RequestParam(required = false) String month)
    {
        Optional<User> optionalUser = userRepository.findById(userId); if (optionalUser.isEmpty())
        return ResponseEntity.ok(Collections.emptyList()); User user = optionalUser.get();
        List<String> attendance = new ArrayList<>(user.getAttendance());
        if (month != null) { attendance = attendance.stream() .filter(date -> date.startsWith(month)) .collect(Collectors.toList()); }
        return ResponseEntity.ok(attendance);
    }

    // ---------------- Get All Users Attendance ----------------
    @GetMapping("/attendance")
    public ResponseEntity<List<Map<String, Object>>> getAllUsersAttendance() {
        List<User> users = userRepository.findByRole("USER");
        // only regular users
        List<Map<String, Object>> result = users.stream().map(u -> Map.of( "id", u.getId(), "name", u.getName(), "email", u.getEmail(), "attendance", u.getAttendance() )).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }
}