package com.project.Hospital.Controller;

import com.project.Hospital.Repository.AttendanceRepository;
import com.project.Hospital.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @GetMapping("/stats")
    public Map<String, Object> getStats() {

        Map<String, Object> response = new HashMap<>();

        long totalUsers = userRepository.countByRole("USER");
        long totalAdmins = userRepository.countByRole("ADMIN");

        long presentToday = attendanceRepository
                .countByDateAndPresent(LocalDate.now(), true);

        int attendancePercentage = totalUsers == 0
                ? 0
                : (int) ((presentToday * 100) / totalUsers);

        List<Map<String, Object>> weeklyAttendance =
                attendanceRepository.getWeeklyAttendance(LocalDate.now().minusDays(6));

        response.put("totalUsers", totalUsers);
        response.put("totalAdmins", totalAdmins);
        response.put("attendanceToday", attendancePercentage);
        response.put("weeklyAttendance", weeklyAttendance);

        return response;
    }
}
