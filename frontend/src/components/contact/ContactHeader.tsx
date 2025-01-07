import React from "react";

interface ContactHeaderProps {
  title: string;
  icon: React.ReactNode;
}

function ContactHeader({ title, icon }: ContactHeaderProps) {
  return (
    <div className="w-full flex items-center px-4 py-5 border-b border-base-300 gap-2">
      {icon}
      <h2 className="text-xl font-medium text-base-content">{title}</h2>
    </div>
  );
}

export default ContactHeader;
