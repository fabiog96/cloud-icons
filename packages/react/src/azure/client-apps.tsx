import { createIcon } from "../icon-base";

export const AzureClientApps = createIcon(
  "AzureClientApps",
  "0 0 18 18",
  () => (
    <>
      <defs><linearGradient id="client-apps-a" x1="9" x2="9" y1="17" y2="1" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#0078d4"/><stop offset=".16" stopColor="#1380da"/><stop offset=".53" stopColor="#3c91e5"/><stop offset=".82" stopColor="#559cec"/><stop offset="1" stopColor="#5ea0ef"/></linearGradient></defs><path fill="url(#client-apps-a)" d="M6.6 12.2h4.8V17H6.6ZM1 5.8h4.8V1H1.67a.67.67 0 0 0-.67.67ZM1.67 17H5.8v-4.8H1v4.13a.67.67 0 0 0 .67.67M1 11.4h4.8V6.6H1ZM12.2 17h4.13a.67.67 0 0 0 .67-.67V12.2h-4.8Zm-5.6-5.6h4.8V6.6H6.6Zm5.6 0H17V6.6h-4.8Zm0-10.4v4.8H17V1.67a.67.67 0 0 0-.67-.67ZM6.6 5.8h4.8V1H6.6Z"/>
    </>
  ),
);
