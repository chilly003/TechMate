package io.ssafy.p.s12b201.techmate.domain.userarticleread.domain;

import io.ssafy.p.s12b201.techmate.domain.user.domain.User;
import io.ssafy.p.s12b201.techmate.global.database.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Table(name = "user_article_reads")
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserArticleRead extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_article_read_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String articleId;

    @Builder
    public UserArticleRead(User user, String articleId) {
        this.user = user;
        this.articleId = articleId;
    }
}
