export interface ProjectData {
  number: string;
  category: string;
  title: string;
  description: string;
  focus: string[];
  year: string;
  image: string;
}

export interface PortfolioNavigation {
  enabled: boolean;
  links: {
    work: boolean;
    about: boolean;
    services: boolean;
    contact: boolean;
  };
  showAvailability: boolean;
}

export interface PortfolioData {
  name: string;
  role: string;
  availableYear: string;
  email: string;
  avatar: string;
  aboutHeading: string;
  aboutBody: string;
  services: string[];
  skills: string[];
  navigation: PortfolioNavigation;
  showScrollProgress: boolean;
  projects: ProjectData[];
}
