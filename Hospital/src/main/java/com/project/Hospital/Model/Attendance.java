package com.project.Hospital.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "list")
public class Attendance {

    @Id
    private String id;

    private String userId;

    private LocalDate date;

    private boolean present;
}
