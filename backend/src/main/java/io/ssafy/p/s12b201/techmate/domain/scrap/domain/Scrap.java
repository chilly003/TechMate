package io.ssafy.p.s12b201.techmate.domain.scrap.domain;

import io.ssafy.p.s12b201.techmate.domain.articlelike.domain.ArticleLike;
import io.ssafy.p.s12b201.techmate.domain.memo.domain.Memo;
import io.ssafy.p.s12b201.techmate.domain.user.domain.AccountRole;
import io.ssafy.p.s12b201.techmate.domain.user.domain.User;
import io.ssafy.p.s12b201.techmate.global.database.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Table(name = "scraps")
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Scrap extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "scrap_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "scrap", cascade = CascadeType.ALL)
    private final List<Memo> memoList = new ArrayList<>();

    private String articleId;

    private String articleTitle;

    @Builder
    public Scrap(User user, String articleId, String articleTitle) {
        this.user = user;
        this.articleId = articleId;
        this.articleTitle = articleTitle;
    }
}
