package com.project.Hospital.Repository;

import com.project.Hospital.Model.Attendance;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Aggregation;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface AttendanceRepository extends MongoRepository<Attendance, String> {

    // ✅ Today's attendance count
    long countByDateAndPresent(LocalDate date, boolean present);

    // ✅ Weekly attendance aggregation
    @Aggregation(pipeline = {
            "{ $match: { present: true, date: { $gte: ?0 } } }",
            "{ $group: { _id: { $dayOfWeek: \"$date\" }, attendance: { $sum: 1 } } }",
            "{ $sort: { _id: 1 } }"
    })
    List<Map<String, Object>> getWeeklyAttendance(LocalDate startDate);
}
