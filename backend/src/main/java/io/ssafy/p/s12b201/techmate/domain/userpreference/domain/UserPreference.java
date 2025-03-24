package io.ssafy.p.s12b201.techmate.domain.userpreference.domain;

import io.ssafy.p.s12b201.techmate.domain.user.domain.User;
import io.ssafy.p.s12b201.techmate.global.database.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Table(name = "user_preference")
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserPreference extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "preference_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private Long articleId;

    @Builder
    public UserPreference(User user, Long articleId) {
        this.user = user;
        this.articleId = articleId;
    }
}
