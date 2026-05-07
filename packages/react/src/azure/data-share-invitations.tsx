import { createIcon } from "../icon-base";

export const AzureDataShareInvitations = createIcon(
  "AzureDataShareInvitations",
  "0 0 18 18",
  () => (
    <>
      <defs><linearGradient id="data-share-invitations-b" x1="9" x2="9" y1="9.05" y2="14.65" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#005ba1"/><stop offset=".26" stopColor="#00589d"/><stop offset=".53" stopColor="#004f90"/><stop offset=".8" stopColor="#003f7c"/><stop offset="1" stopColor="#003067"/></linearGradient><clipPath id="data-share-invitations-a"><rect width="16.88" height="11.13" x=".56" y="3.43" fill="none" rx=".56"/></clipPath></defs><g clipPath="url(#data-share-invitations-a)"><path fill="#32bedd" d="M.56 3.44v11.21L9 9.05Z"/><path fill="#198ab3" d="M17.44 3.44 9 9.05l8.45 5.59c-.02-.22-.01-11.4-.01-11.2"/><path fill="url(#data-share-invitations-b)" d="M8.97 9.05.56 14.64h16.87v-.01z"/><path fill="#50e6ff" d="M.56 3.44h16.88L9.09 10a.29.29 0 0 1-.35 0Z"/></g>
    </>
  ),
);
