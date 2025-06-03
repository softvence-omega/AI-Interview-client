import React from "react";
import NotificationViewer from "./NotificationViewer";
import SendNotificationFromAdmin from "./SendNotificationFromAdmin";

const NotificationPage = () => {
  return (
    <div className="flex flex-col-reverse md:grid lg:grid md:grid-cols-3 lg:grid-cols-5">
      <div className="col-span-3">
        <NotificationViewer />
      </div>
      <div className="col-span-2">
        <SendNotificationFromAdmin />
      </div>
    </div>
  );
};

export default NotificationPage;
