import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Users, MessageSquare, AlertTriangle, Vote, CheckCircle2, Settings, Trash2 } from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "join_request",
    title: "New join request",
    message: "Sarah Ahmed wants to join Green Valley Community",
    time: "5 minutes ago",
    read: false,
    icon: Users,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-100 dark:bg-blue-900/50",
  },
  {
    id: 2,
    type: "alert",
    title: "Emergency Alert",
    message: "Security alert reported in Block C area",
    time: "15 minutes ago",
    read: false,
    icon: AlertTriangle,
    iconColor: "text-red-500",
    iconBg: "bg-red-100 dark:bg-red-900/50",
  },
  {
    id: 3,
    type: "message",
    title: "New message",
    message: "Karim: Hey, are you coming to the meeting tomorrow?",
    time: "1 hour ago",
    read: false,
    icon: MessageSquare,
    iconColor: "text-green-500",
    iconBg: "bg-green-100 dark:bg-green-900/50",
  },
  {
    id: 4,
    type: "survey",
    title: "Survey ending soon",
    message: "Community Park Renovation survey ends in 2 days",
    time: "2 hours ago",
    read: true,
    icon: Vote,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-100 dark:bg-purple-900/50",
  },
  {
    id: 5,
    type: "approval",
    title: "Request approved",
    message: "Your request to join Tech Hub District has been approved",
    time: "1 day ago",
    read: true,
    icon: CheckCircle2,
    iconColor: "text-green-500",
    iconBg: "bg-green-100 dark:bg-green-900/50",
  },
  {
    id: 6,
    type: "notice",
    title: "New notice posted",
    message: "Monthly community meeting scheduled for Saturday",
    time: "2 days ago",
    read: true,
    icon: Bell,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-100 dark:bg-orange-900/50",
  },
];

const Notifications = () => {
  const [notificationList, setNotificationList] = useState(notifications);

  const unreadCount = notificationList.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotificationList(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotificationList(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotificationList(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotificationList([]);
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <Badge className="bg-primary">{unreadCount} new</Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark all read
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-1.5 text-xs px-1.5">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4 space-y-2">
            {notificationList.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No notifications yet</p>
                </CardContent>
              </Card>
            ) : (
              notificationList.map((notification) => {
                const Icon = notification.icon;
                return (
                  <Card 
                    key={notification.id} 
                    className={`transition-all hover:shadow-md cursor-pointer ${
                      !notification.read ? 'border-l-4 border-l-primary bg-primary/5' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${notification.iconBg}`}>
                          <Icon className={`h-4 w-4 ${notification.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className={`font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <div className="w-2 h-2 rounded-full bg-primary" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="unread" className="mt-4 space-y-2">
            {notificationList.filter(n => !n.read).length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-green-500/50 mb-4" />
                  <p className="text-muted-foreground">All caught up!</p>
                </CardContent>
              </Card>
            ) : (
              notificationList.filter(n => !n.read).map((notification) => {
                const Icon = notification.icon;
                return (
                  <Card 
                    key={notification.id} 
                    className="border-l-4 border-l-primary bg-primary/5 transition-all hover:shadow-md cursor-pointer"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${notification.iconBg}`}>
                          <Icon className={`h-4 w-4 ${notification.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{notification.title}</p>
                          <p className="text-sm text-muted-foreground truncate">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="alerts" className="mt-4 space-y-2">
            {notificationList.filter(n => n.type === 'alert').map((notification) => {
              const Icon = notification.icon;
              return (
                <Card 
                  key={notification.id} 
                  className={`transition-all hover:shadow-md ${!notification.read ? 'border-l-4 border-l-red-500' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${notification.iconBg}`}>
                        <Icon className={`h-4 w-4 ${notification.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="messages" className="mt-4 space-y-2">
            {notificationList.filter(n => n.type === 'message').map((notification) => {
              const Icon = notification.icon;
              return (
                <Card 
                  key={notification.id} 
                  className={`transition-all hover:shadow-md ${!notification.read ? 'border-l-4 border-l-primary' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${notification.iconBg}`}>
                        <Icon className={`h-4 w-4 ${notification.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>

        {notificationList.length > 0 && (
          <div className="text-center">
            <Button variant="ghost" className="text-muted-foreground" onClick={clearAll}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear all notifications
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Notifications;
