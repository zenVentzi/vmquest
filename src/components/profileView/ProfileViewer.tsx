import React, { Component, Fragment } from "react";
import { ThemeProvider } from "styled-components";
import { getLoggedUserId, overrideTheme } from "Utils";
import Avatar from "../reusable/Avatar";
import Username from "./Username";
import Intro from "./Intro";
import FollowBtn from "./FollowBtn";
import FollowingBtn from "./FollowingBtn";
import FollowersBtn from "./FollowersBtn";
import Followers from "./Followers";
import Following from "./Following";
import Links from "./Links";
import QuestionsContainer from "./questions";
import Search from "./Search";
import ToggleQuestions from "./questions/ToggleQuestions";

interface ProfileViewerProps {
  user: any;
}

class ProfileViewer extends Component<ProfileViewerProps, any> {
  state = {
    showFollowers: false,
    showFollowing: false
  };

  toggleFollowers = () => {
    this.setState((prevState: any) => ({
      ...prevState,
      showFollowers: !prevState.showFollowers
    }));
  };

  toggleFollowing = () => {
    this.setState((prevState: any) => ({
      ...prevState,
      showFollowing: !prevState.showFollowing
    }));
  };

  render() {
    const { user } = this.props;
    const { showFollowers, showFollowing } = this.state;
    const isFollowed =
      user.followers && user.followers.includes(getLoggedUserId());
    const theme = {
      avatarSize: "150px"
    };

    return (
      <ThemeProvider theme={overrideTheme(theme)}>
        <Fragment>
          <Avatar src={user.avatarSrc} editable={user.me} />
          <Username>{user.fullName}</Username>
          <Intro>{user.intro}</Intro>
          {!user.me && <FollowBtn isFollowed={isFollowed} userId={user.id} />}
          <div>
            <FollowingBtn
              following={user.following}
              onClick={this.toggleFollowing}
            />
            <FollowersBtn
              followers={user.followers}
              onClick={this.toggleFollowers}
            />
          </div>
          {showFollowers && (
            <Followers userId={user.id} onClose={this.toggleFollowers} />
          )}
          {showFollowing && (
            <Following userId={user.id} onClose={this.toggleFollowing} />
          )}
          <Links />
          {/* <Search placeholder="Search questions.." onChange={() => {}} /> */}
          <QuestionsContainer user={user} />
        </Fragment>
      </ThemeProvider>
    );
  }
}

export default ProfileViewer;