import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section";
import { SanityImage } from "@/components/ui/sanity-image";
import { getTeamMembers } from "@/lib/team";
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";

export async function Team({
  eyebrow = "Leadership",
  heading = "The people behind Adakings",
}: {
  eyebrow?: string;
  heading?: string;
}) {
  const team = await getTeamMembers();
  if (team.length === 0) return null;

  return (
    <Section>
      <Container>
        <SectionHeading eyebrow={eyebrow} title={heading} align="center" className="mx-auto" />
        <div className="mt-8 grid grid-cols-2 gap-6 sm:mt-12 sm:gap-8 lg:grid-cols-4">
          {team.map((member) => (
            <div key={member.name} className="text-center">
              <SanityImage
                image={member.photo}
                fallbackLabel={member.name}
                className="mx-auto aspect-square w-32 rounded-full"
                sizes="128px"
              />
              <h3 className="mt-4 text-base font-semibold">{member.name}</h3>
              <p className="text-sm text-muted-foreground">{member.position}</p>
              {member.biography ? (
                <p className="mt-2 text-sm text-muted-foreground">{member.biography}</p>
              ) : null}
              {member.socialLinks ? (
                <div className="mt-3 flex items-center justify-center gap-3 text-muted-foreground">
                  {member.socialLinks.instagram ? (
                    <a href={member.socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on Instagram`} className="hover:text-foreground">
                      <Instagram className="size-4" />
                    </a>
                  ) : null}
                  {member.socialLinks.facebook ? (
                    <a href={member.socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on Facebook`} className="hover:text-foreground">
                      <Facebook className="size-4" />
                    </a>
                  ) : null}
                  {member.socialLinks.twitter ? (
                    <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on Twitter`} className="hover:text-foreground">
                      <Twitter className="size-4" />
                    </a>
                  ) : null}
                  {member.socialLinks.linkedin ? (
                    <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on LinkedIn`} className="hover:text-foreground">
                      <Linkedin className="size-4" />
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
