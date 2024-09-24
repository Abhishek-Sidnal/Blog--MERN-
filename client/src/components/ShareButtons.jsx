import React from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "react-share";

const ShareButtons = ({ url, title }) => {
  const buttons = [
    { Component: FacebookShareButton, Icon: FacebookIcon, label: "Facebook" },
    { Component: TwitterShareButton, Icon: TwitterIcon, label: "Twitter" },
    { Component: WhatsappShareButton, Icon: WhatsappIcon, label: "WhatsApp" },
    { Component: LinkedinShareButton, Icon: LinkedinIcon, label: "LinkedIn" },
  ];

  return (
    <div className="flex space-x-3 items-center">
      {buttons.map(({ Component, Icon, label }, index) => (
        <Component
          key={index}
          url={url}
          title={title}
          aria-label={`Share on ${label}`}
          className="hover:opacity-75 transition-opacity duration-300"
        >
          <Icon size={32} round={true} />
        </Component>
      ))}
    </div>
  );
};

export default ShareButtons;
