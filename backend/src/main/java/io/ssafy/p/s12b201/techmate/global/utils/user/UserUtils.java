package io.ssafy.p.s12b201.techmate.global.utils.user;

import io.ssafy.p.s12b201.techmate.domain.user.domain.User;

public interface UserUtils {

    User getUserById(Long id);
    User getUserFromSecurityContext();

}
