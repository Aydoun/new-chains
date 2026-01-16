"use client";

import { useState } from "react";
import { Bell, BellOff, UserCheck, Users, X } from "lucide-react";
import { Carousel } from "@/components/ui/carousel";
import {
  useFollowSequenceMutation,
  useGetSequenceByIdQuery,
  useGetSequenceNotificationsQuery,
  useMuteSequenceMutation,
} from "@/app/services/sequences";
import { translate } from "@/lib/i18n";
import { Modal } from "./ui/modal";
import { SequenceFrame } from "./sequence-card";
import { skipToken } from "@reduxjs/toolkit/query";
import { Badge, Button, Callout, Flex, Spinner, Text } from "@radix-ui/themes";
import { useSession } from "next-auth/react";

interface Props {
  sequenceId: string | number | null;
  onClose: () => void;
}

export function ViewSequence({ sequenceId, onClose }: Props) {
  const [activeFrame, setActiveFrame] = useState(0);
  const { data, isFetching, isError, refetch } = useGetSequenceByIdQuery(
    sequenceId ?? skipToken
  );
  const { data: session } = useSession();
  const viewerId = session?.user?.id ? parseInt(session.user.id, 10) : null;
  const isAuthor = viewerId === data?.userId;
  const [followSequence, { isLoading: isSavingFollow }] =
    useFollowSequenceMutation();
  const [muteSequence, { isLoading: isSavingMute }] = useMuteSequenceMutation();
  const notificationsQueryArg =
    sequenceId && viewerId ? { sequenceId } : skipToken;
  const {
    data: notifications,
    isFetching: isFetchingNotifications,
  } = useGetSequenceNotificationsQuery(notificationsQueryArg);
  const guardedFrames = data?.frames ?? [];
  const followerCount = data?.followerCount ?? data?.followers?.length ?? 0;
  const followers = data?.followers ?? [];
  const isFollower = Boolean(data?.viewerState?.isFollower);
  const isMuted = Boolean(data?.viewerState?.isMuted);

  const handleDialogChange = (open: boolean) => {
    if (!open) onClose();
  };

  const canInteractWithFollowers =
    Boolean(viewerId) && !Number.isNaN(viewerId) && !isAuthor;

  const handleFollowToggle = async () => {
    if (!sequenceId || !canInteractWithFollowers) return;

    await followSequence({
      sequenceId,
      action: isFollower ? "unfollow" : "follow",
    }).unwrap();
    await refetch();
  };

  const handleMuteToggle = async () => {
    if (!sequenceId || !canInteractWithFollowers) return;

    await muteSequence({
      sequenceId,
      muted: !isMuted,
    }).unwrap();
    await refetch();
  };

  if (!sequenceId) return null;

  return (
    <Modal open onOpenChange={handleDialogChange}>
      <Modal.Content className="border rounded-2xl bg-gray-900 p-8 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 mb-4">
            <h2 className="text-xl font-semibold text-white">
              {data?.title ?? ""}
            </h2>
          </div>
          <Modal.Close aria-label="Close" onClick={onClose}>
            <X className="h-4 w-4" />
          </Modal.Close>
        </div>
        {!isFetching && !isError && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 rounded-lg border border-[#233348] bg-[#0f1723] p-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-amber-100">
                  <Users className="h-4 w-4" aria-hidden="true" />
                  <Text size="2" weight="bold">
                    {followerCount} follower{followerCount === 1 ? "" : "s"}
                  </Text>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleFollowToggle}
                    disabled={!canInteractWithFollowers || isSavingFollow}
                    variant={isFollower ? "surface" : "solid"}
                    className="cursor-pointer"
                  >
                    {isSavingFollow ? (
                      <Spinner size="1" />
                    ) : (
                      <UserCheck className="h-4 w-4" aria-hidden="true" />
                    )}
                    {isFollower ? "Unfollow" : "Follow"}
                  </Button>
                  <Button
                    onClick={handleMuteToggle}
                    disabled={
                      !canInteractWithFollowers || !isFollower || isSavingMute
                    }
                    variant="ghost"
                    className="cursor-pointer"
                  >
                    {isSavingMute ? (
                      <Spinner size="1" />
                    ) : isMuted ? (
                      <BellOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Bell className="h-4 w-4" aria-hidden="true" />
                    )}
                    {isMuted ? "Unmute" : "Mute"}
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {followers?.slice(0, 6).map((follower) => (
                  <Badge
                    key={follower.id}
                    color={follower.muted ? "gray" : "blue"}
                    variant="surface"
                  >
                    {follower.username}
                    {follower.muted ? " (muted)" : ""}
                  </Badge>
                ))}
                {followers && followerCount > 6 && (
                  <Text size="1" className="text-[#92a9c9]">
                    +{followerCount - 6} more
                  </Text>
                )}
              </div>
              {!canInteractWithFollowers && (
                <Text size="1" className="text-[#92a9c9]">
                  {isAuthor
                    ? "You own this sequence."
                    : "Sign in to follow or mute this sequence."}
                </Text>
              )}
            </div>
            <div className="text-xs text-amber-100">
              <span className="font-semibold uppercase tracking-wide">
                {translate("frame.selfs")}
              </span>
              <span className="ml-2 rounded-full bg-primary-main px-3 py-1 font-semibold shadow-sm ring-1 ring-amber-700/60">
                {data?.FrameOrder.length ?? 0} {translate("common.items")}
              </span>
            </div>
            <Carousel
              frames={
                guardedFrames.length > 0
                  ? guardedFrames.map((frame, index) => (
                      <SequenceFrame
                        key={frame?.id ?? index}
                        text={frame?.content}
                        description={frame?.description}
                      />
                    ))
                  : [
                      <SequenceFrame
                        key="empty"
                        text={translate("frame.empty")}
                      />,
                    ]
              }
              className="w-full"
              currentIndex={activeFrame}
              onNext={() =>
                setActiveFrame((current) => {
                  if (current === guardedFrames.length - 1) return 0;

                  return Math.min(
                    current + 1,
                    Math.max(guardedFrames.length - 1, 0)
                  );
                })
              }
              onPrevious={() =>
                setActiveFrame((current) => Math.max(current - 1, 0))
              }
            />
            {viewerId && notifications && notifications.length > 0 && (
              <div className="mt-2 rounded-lg border border-[#233348] bg-[#0f1723] p-3">
                <Flex align="center" justify="between" gap="2" mb="2">
                  <Text size="2" weight="bold" className="text-white">
                    Notifications
                  </Text>
                  {isFetchingNotifications && <Spinner size="1" />}
                </Flex>
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                  {notifications.map((notification) => (
                    <Callout.Root
                      key={notification.id}
                      size="1"
                      color="blue"
                      variant="surface"
                    >
                      <Callout.Text className="text-sm text-white">
                        {notification.message}
                      </Callout.Text>
                      <Callout.Text className="text-xs text-[#92a9c9]">
                        {new Date(notification.createdAt).toLocaleString()}
                      </Callout.Text>
                    </Callout.Root>
                  ))}
                </div>
                {isMuted && (
                  <Callout.Root className="mt-2" color="gray" variant="surface">
                    <Callout.Text className="text-xs text-[#92a9c9]">
                      Notifications are muted for this sequence.
                    </Callout.Text>
                  </Callout.Root>
                )}
              </div>
            )}
          </div>
        )}
      </Modal.Content>
    </Modal>
  );
}
