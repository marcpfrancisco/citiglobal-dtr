package com.ctg.dtr.model;

import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Timesheet {

    @Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

    @CreationTimestamp 
    private Date createdAt;
    
    @UpdateTimestamp 
    private Date updatedAt;

    @Temporal(TemporalType.DATE)
    private Date date;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = true)
    private Date timeIn;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = true)
    private Date timeOut;

    private String timeRendered;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
