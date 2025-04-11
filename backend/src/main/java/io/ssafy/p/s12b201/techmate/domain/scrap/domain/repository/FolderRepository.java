package io.ssafy.p.s12b201.techmate.domain.scrap.domain.repository;

import io.ssafy.p.s12b201.techmate.domain.scrap.domain.Folder;
import io.ssafy.p.s12b201.techmate.domain.user.domain.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


public interface FolderRepository extends JpaRepository<Folder, Long> {

    //boolean existsByFolderName(String folderName);

    boolean existsByFolderNameAndUser(String folderName, User user);

    @Query("select f from Folder f where f.user.id = :userId order by f.lastModifiedAt desc")
    Slice<Folder> findAllUserFolder(Long userId, Pageable pageable);

}
