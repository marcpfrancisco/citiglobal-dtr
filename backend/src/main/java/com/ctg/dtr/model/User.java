package com.ctg.dtr.model;

import java.util.Date;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
// @EqualsAndHashCode(exclude="roles")
public class User {

    @Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

    @CreationTimestamp
    private Date createdAt;
    
    @UpdateTimestamp 
    private Date updatedAt;

    private String publishedAt;

    private Boolean isActive;

    private String firstName;

    private String middleName;

    private String lastName;

    private String mobileNumber;

    private String studentId;

    private String rfidNo;

    private String username;

    private String password;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id", referencedColumnName = "id", nullable = true)
    private Section section;

    // @ManyToMany(cascade = { CascadeType.MERGE, CascadeType.PERSIST })
    // @JoinTable(name = "users_roles", joinColumns = { @JoinColumn(name = "user_id") }, inverseJoinColumns = {
    //         @JoinColumn(name = "role_id") })
    // private Set<Role> roles;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", referencedColumnName = "id", nullable = true)
    private Role role;

    @OneToMany(mappedBy = "user")
	@JsonIgnore
    private List<Timesheet> timesheets;

    @OneToMany(mappedBy = "user")
	@JsonIgnore
    private List<Image> image;

    // public void addRole(Role role) {
    //     this.roles.add(role);
    //     role.getUsers().add(this);
    // }
}
