package com.ctg.dtr.model;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@EqualsAndHashCode(exclude = "subjects")
public class User {

    @Id
    @GeneratedValue(generator = "user-sequence-generator")
    @GenericGenerator(
      name = "user-sequence-generator",
      strategy = "org.hibernate.id.enhanced.SequenceStyleGenerator",
      parameters = {
        @Parameter(name = "sequence_name", value = "user_seq"),
        @Parameter(name = "initial_value", value = "3"),
        @Parameter(name = "increment_size", value = "1")
        }
    )
	private Long id;

    @CreationTimestamp
    private Date createdAt;

    @UpdateTimestamp
    private Date updatedAt;

    private Date publishedAt;

    @Column(nullable = false)
    private Boolean isActive;

    @Column(nullable = false)
    private String firstName;

    private String middleName;

    @Column(nullable = false)
    private String lastName;

    private String mobileNo;

    @Column(nullable = false)
    private String studentNo;

    @Column(nullable = false)
    private String rfidNo;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    // @ManyToMany(cascade = { CascadeType.MERGE, CascadeType.PERSIST })
    // @JoinTable(name = "users_roles", joinColumns = { @JoinColumn(name = "user_id") }, inverseJoinColumns = {
    //         @JoinColumn(name = "role_id") })
    // private Set<Role> roles;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id", referencedColumnName = "id", nullable = true)
    private Section section;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", referencedColumnName = "id", nullable = false)
    private Role role;

    @OneToMany(mappedBy = "user")
	@JsonIgnore
    private List<Timesheet> timesheets;

    @OneToMany(mappedBy = "user")
	@JsonIgnore
    private List<Image> image;

    @ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(name = "users_subjects",
            joinColumns = { @JoinColumn(name = "user_id") },
            inverseJoinColumns = { @JoinColumn(name = "subject_id") })
    private Set<Subject> subjects = new HashSet<>();

    @OneToMany(mappedBy = "user")
	@JsonIgnore
    private List<UsersSubjects> usersSubjects;

    // public void addRole(Role role) {
    //     this.roles.add(role);
    //     role.getUsers().add(this);
    // }

    public void addSubject(Subject subject) {
        this.subjects.add(subject);
        subject.getUsers().add(this);
    }

    public void removeSubject(Long subjectId) {
        Subject subject = this.subjects.stream().filter(s -> s.getId() == subjectId).findFirst().orElse(null);
        if (subject != null) {
            this.subjects.remove(subject);
            subject.getUsers().remove(this);
        }
    }
}
