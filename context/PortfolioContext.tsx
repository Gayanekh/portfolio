export interface ProjectData {
  number: string;
  category: string;
  title: string;
  description: string;
  focus: string[];
  year: string;
  image: string;
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
  projects: ProjectData[];
}
