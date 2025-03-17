import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const UserProfilePage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    return (
        <div>
            <h1>User Profile</h1>
        </div>
    );
};

export default UserProfilePage;
