package com.ctg.dtr.model;

import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Subject {

    @Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

    @CreationTimestamp 
    private Date createdAt;
    
    @UpdateTimestamp 
    private Date updatedAt;

    private Date publishedAt;

    private Boolean isActive;

    private String subjectCode;

    private String description;

    private String day;

    private String startTime;

    private String endTime;

    private String gracePeriod;

    private Integer units;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id", referencedColumnName = "id", nullable = true)
    private Section section;

}
