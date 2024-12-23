import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin } from "lucide-react";
import { logEvent } from "@/lib/analytics";

interface SocialShareProps {
  url?: string;
  title?: string;
  description?: string;
}

export function SocialShare({
  url = window.location.href,
  title = "Property Management Dashboard",
  description = "Modern property management solution for tracking properties, tenants, and maintenance requests",
}: SocialShareProps) {
  const handleShare = (platform: string) => {
    logEvent("Social", "Share", platform);

    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`,
    };

    window.open(urls[platform as keyof typeof urls], "_blank");
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare("facebook")}
        className="hover:bg-blue-50"
      >
        <Facebook className="h-4 w-4 text-blue-600" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare("twitter")}
        className="hover:bg-sky-50"
      >
        <Twitter className="h-4 w-4 text-sky-500" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare("linkedin")}
        className="hover:bg-blue-50"
      >
        <Linkedin className="h-4 w-4 text-blue-700" />
      </Button>
    </div>
  );
}
