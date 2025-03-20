package io.ssafy.p.s12b201.techmate.domain.user.domain;

import io.ssafy.p.s12b201.techmate.domain.articlelike.domain.ArticleLike;
import io.ssafy.p.s12b201.techmate.domain.quizresult.domain.QuizResult;
import io.ssafy.p.s12b201.techmate.domain.articleread.domain.ArticleRead;
import io.ssafy.p.s12b201.techmate.domain.userpreference.domain.UserPreference;
import io.ssafy.p.s12b201.techmate.global.database.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Table(name = "users")
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private final List<ArticleLike> articleLikeList = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private final List<ArticleRead> articleReadList = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private final List<QuizResult> quizResultList = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private final List<UserPreference> userPreferenceList = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "user_preferences", joinColumns =
    @JoinColumn(name = "user_id")
    )
    @Column(name = "article_id")
    private List<String> preferenceArticle = new ArrayList<>();

    private String nickname;

    private String oauthProvider;

    private String email;

    private String oauthId;

    private Boolean isNew;

    @Enumerated(EnumType.STRING)
    private final AccountRole accountRole = AccountRole.USER;

    @Builder
    public User(
            String nickname,
            String oauthProvider,
            String email,
            String oauthId,
            Boolean isNew
    ) {
        this.nickname = nickname;
        this.oauthProvider = oauthProvider;
        this.email = email;
        this.oauthId = oauthId;
        this.isNew = isNew;

    }

}
