type AvatarTone = "purple" | "teal" | "green" | "amber" | "red";
type AvatarSize = "sm" | "md" | "lg";

export function Avatar({
  initials,
  size = "md",
  tone = "purple"
}: {
  initials: string;
  size?: AvatarSize;
  tone?: AvatarTone;
}) {
  return <span className={`avatar avatar-${size} av-${tone}`}>{initials}</span>;
}

export function AvatarGroup({
  avatars
}: {
  avatars: Array<{ initials: string; tone: AvatarTone }>;
}) {
  return (
    <div className="avatar-group" aria-label={`${avatars.length} participants`}>
      {avatars.map((avatar) => (
        <Avatar key={`${avatar.initials}-${avatar.tone}`} {...avatar} />
      ))}
    </div>
  );
}
