import React from "react";

import { useParams } from "react-router";

export function ProfilePage() {
  const { username } = useParams();

  return <div>{username}</div>;
}

export default ProfilePage;
