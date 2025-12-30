package com.project.Hospital.Model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Document(collection = "list")
public class User {

    @Id
    private String id;

    private String name;
    private String email;
    private String password;
    private String mobile;
    private Integer age;
    private String role; // "ADMIN" or "USER"

    private List<String> attendance = new ArrayList<>();

    public void addAttendance(String date) {
        if (!attendance.contains(date)) {
            attendance.add(date);
        }
    }
}