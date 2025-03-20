package io.ssafy.p.s12b201.techmate.domain.scrap.domain;

import io.ssafy.p.s12b201.techmate.domain.user.domain.User;
import io.ssafy.p.s12b201.techmate.global.database.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Table(name = "memos")
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Memo extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "memo_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToOne(mappedBy = "memo", cascade = CascadeType.ALL)
    private Scrap scrap;

    private String content;

    @Builder
    public Memo(User user, String content) {
        this.user = user;
        this.content = content;
    }

    // 연관관계 편의 메서드
    public void addScrap(Scrap scrap) {
        this.scrap = scrap;
    }
}
