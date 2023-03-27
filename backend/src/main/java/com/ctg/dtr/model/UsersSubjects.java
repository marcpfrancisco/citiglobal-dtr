package com.ctg.dtr.model;

import java.io.Serializable;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users_subjects")
public class UsersSubjects {

  @EmbeddedId
  private UsersSubjectsId id = new UsersSubjectsId();

  @ManyToOne(fetch = FetchType.LAZY, optional = false, targetEntity = User.class)
  @JoinColumn(name = "user_id", referencedColumnName = "id", insertable = false, updatable = false)
  @MapsId("userId")
  private User user;

  @ManyToOne(fetch = FetchType.LAZY, optional = false, targetEntity = Subject.class)
  @JoinColumn(name = "subject_id", referencedColumnName = "id", insertable = false, updatable = false)
  @MapsId("subjectId")
  private Subject subject;

  @Data
  @AllArgsConstructor
  @NoArgsConstructor
  @Embeddable
  public static class UsersSubjectsId implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long userId;

    private Long subjectId;
  }
}
