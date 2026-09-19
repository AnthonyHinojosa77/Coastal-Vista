import { ArrowUpRight, Facebook, Instagram } from 'lucide-react';

const profiles = [
  { name: 'Instagram', profile: '@coastalvistatx', url: 'https://www.instagram.com/coastalvistatx/', Icon: Instagram },
  { name: 'Facebook', profile: 'Coastal Vista', url: 'https://www.facebook.com/profile.php?id=61578649832040', Icon: Facebook },
];

export default function SocialLinks() {
  return (
    <ul className="social-links" aria-label="Coastal Vista social profiles">
      {profiles.map(({ name, profile, url, Icon }) => (
        <li key={name}>
          <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`Coastal Vista on ${name} (opens in a new tab)`}>
            <Icon size={20} aria-hidden="true" />
            <span><span className="social-platform">{name}</span><span className="social-profile">{profile}</span></span>
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}
