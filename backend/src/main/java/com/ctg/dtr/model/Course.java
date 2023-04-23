package com.ctg.dtr.model;

import java.util.Date;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Course {

    @Id
    @GeneratedValue(generator = "course-sequence-generator")
    @GenericGenerator(
      name = "course-sequence-generator",
      strategy = "org.hibernate.id.enhanced.SequenceStyleGenerator",
      parameters = {
        @Parameter(name = "sequence_name", value = "course_seq"),
        @Parameter(name = "initial_value", value = "4"),
        @Parameter(name = "increment_size", value = "1")
        }
    )
	private Long id;

    @CreationTimestamp
    private Date createdAt;

    @UpdateTimestamp
    private Date updatedAt;

    private Date publishedAt;

    private Boolean isActive;

    private String name;

    @OneToMany(mappedBy = "course")
	@JsonIgnore
    private List<Section> sections;
}
