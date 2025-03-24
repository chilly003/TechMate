package io.ssafy.p.s12b201.techmate.domain.scrap.domain;

import io.ssafy.p.s12b201.techmate.domain.scrap.excepcion.NotFolderHostException;
import io.ssafy.p.s12b201.techmate.domain.user.domain.User;
import io.ssafy.p.s12b201.techmate.global.database.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Table(name = "folders")
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Folder extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "folder_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "folder", cascade = CascadeType.ALL)
    private final List<Scrap> scrapList = new ArrayList<>();

    private String folderName;

    @Builder
    public Folder(User user, String folderName) {
        this.user = user;
        this.folderName = folderName;
    }

    public void validUserIsHost(Long id) {
        if (!checkUserIsHost(id)) {
            throw NotFolderHostException.EXCEPTION;
        }

    }

    public Boolean checkUserIsHost(Long id) {
        return user.getId().equals(id);
    }

    public void updateFolder(String folderName) {
        this.folderName = folderName;
    }
}
