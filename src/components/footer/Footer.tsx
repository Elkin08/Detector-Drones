import React from "react";
import { SiInstagram, SiX, SiYoutube } from "react-icons/si";
import { IconType } from "react-icons";
import Link from "next/link";

export const Footer = () => {
  return (
    <div className="border-t border-red-500/20 bg-zinc-950/95">
      <footer className="relative mx-auto max-w-6xl overflow-hidden py-12 text-zinc-200">
        <div className="grid grid-cols-12 gap-x-3 gap-y-6 px-4 md:px-6">
          <LogoColumn />
          <GenericColumn
            title="Sistema"
            links={[
              { title: "Panel de Misión", href: "/" },
              { title: "Modo Detección", href: "/" },
              { title: "Seguimiento", href: "/" },
            ]}
          />
          <GenericColumn
            title="Proyecto"
            links={[
              {
                title: "Arquitectura",
                href: "/",
              },
              {
                title: "Roadmap",
                href: "/",
              },
              {
                title: "Contacto Técnico",
                href: "/",
              },
            ]}
          />

          <GenericColumn
            title="Canales"
            links={[
              {
                title: "X",
                href: "/#",
                Icon: SiX,
              },
              {
                title: "Instagram",
                href: "/#",
                Icon: SiInstagram,
              },
              {
                title: "Youtube",
                href: "/#",
                Icon: SiYoutube,
              },
            ]}
          />
        </div>
      </footer>
    </div>
  );
};

const LogoColumn = () => {
  return (
    <div className="col-span-6 md:col-span-4">
      <span className="inline-block text-lg font-black tracking-wider text-red-500">
        DETECTOR DE DRONES
      </span>
      <span className="mt-3 block text-xs text-zinc-400">
        Centro táctico de detección y rastreo en tiempo real.
      </span>
      <span className="mt-1 inline-block text-xs text-zinc-500">
        © 2026 Detector de Drones
      </span>
    </div>
  );
};

const GenericColumn = ({
  title,
  links,
}: {
  title: string;
  links: { title: string; href: string; Icon?: IconType }[];
}) => {
  return (
    <div className="col-span-6 space-y-2 text-sm md:col-span-2">
      <span className="block font-bold text-cyan-300">{title}</span>
      {links.map((l) => (
        <Link
          key={l.title}
          href={l.href}
          className="flex items-center gap-1.5 text-zinc-300 transition-colors hover:text-red-400 hover:underline"
        >
          {l.Icon && <l.Icon />}
          {l.title}
        </Link>
      ))}
    </div>
  );
};
