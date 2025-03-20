package io.ssafy.p.s12b201.techmate.domain.scrap.domain;

import io.ssafy.p.s12b201.techmate.domain.scrap.excepcion.NotFolderHostException;
import io.ssafy.p.s12b201.techmate.domain.user.domain.User;
import io.ssafy.p.s12b201.techmate.global.database.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "folder_id")
    private Folder folder;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "memo_id")
    private Memo memo;

    private Long articleId;

    @Builder
    public Scrap(User user, Folder folder, Memo memo, Long articleId) {
        this.user = user;
        this.folder = folder;
        this.memo = memo;
        this.articleId = articleId;

    }

    public void validUserIsHost(Long id) {
        if (!checkUserIsHost(id)) {
            throw NotFolderHostException.EXCEPTION;
        }

    }

    public Boolean checkUserIsHost(Long id) {
        return user.getId().equals(id);
    }
}
