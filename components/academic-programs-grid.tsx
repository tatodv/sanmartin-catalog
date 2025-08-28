"use client"

import { AcademicProgramCard } from "./academic-program-card"

export interface AcademicProgram {
  id: string
  title: string
  type: "Licenciatura" | "Maestría" | "Doctorado" | "Especialización" | "Tecnicatura"
  academicUnit: string
  enrollmentPeriod?: {
    start: string
    end: string
  }
  location: {
    institution: string
    address: string
  }
  website?: string
  email?: string
}

const academicPrograms: AcademicProgram[] = [
  {
    id: "1",
    title: "Ingeniería en Sistemas de Información",
    type: "Licenciatura",
    academicUnit: "Facultad de Ingeniería",
    enrollmentPeriod: {
      start: "2024-02-01",
      end: "2024-03-15",
    },
    location: {
      institution: "Universidad San Martín",
      address: "Av. Libertador 1234, Buenos Aires, Argentina",
    },
    website: "https://ingenieria.unsam.edu.ar/sistemas",
    email: "sistemas@unsam.edu.ar",
  },
  {
    id: "2",
    title: "Maestría en Ciencias de Datos",
    type: "Maestría",
    academicUnit: "Escuela de Posgrado",
    location: {
      institution: "Universidad San Martín",
      address: "Campus Miguelete, San Martín, Buenos Aires",
    },
    website: "https://posgrado.unsam.edu.ar/cienciadatos",
    email: "posgrado@unsam.edu.ar",
  },
  {
    id: "3",
    title: "Doctorado en Biotecnología",
    type: "Doctorado",
    academicUnit: "Instituto de Investigaciones Biotecnológicas",
    enrollmentPeriod: {
      start: "2024-04-01",
      end: "2024-05-30",
    },
    location: {
      institution: "Universidad San Martín",
      address: "Av. 25 de Mayo 1021, San Martín, Buenos Aires",
    },
    website: "https://iib.unsam.edu.ar/doctorado",
  },
  {
    id: "4",
    title: "Especialización en Marketing Digital",
    type: "Especialización",
    academicUnit: "Escuela de Economía y Negocios",
    location: {
      institution: "Universidad San Martín",
      address: "Av. Corrientes 456, CABA, Argentina",
    },
    email: "marketing@unsam.edu.ar",
  },
  {
    id: "5",
    title: "Tecnicatura en Programación",
    type: "Tecnicatura",
    academicUnit: "Escuela de Ciencia y Tecnología",
    enrollmentPeriod: {
      start: "2024-03-01",
      end: "2024-04-15",
    },
    location: {
      institution: "Universidad San Martín",
      address: "Campus Miguelete, Edificio Tornavía, San Martín",
    },
    website: "https://ecyt.unsam.edu.ar/programacion",
    email: "programacion@unsam.edu.ar",
  },
  {
    id: "6",
    title: "Licenciatura en Psicología",
    type: "Licenciatura",
    academicUnit: "Escuela de Humanidades",
    location: {
      institution: "Universidad San Martín",
      address: "Av. Bartolomé Mitre 1890, San Martín, Buenos Aires",
    },
    website: "https://humanidades.unsam.edu.ar/psicologia",
  },
]

export function AcademicProgramsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {academicPrograms.map((program) => (
        <AcademicProgramCard key={program.id} program={program} />
      ))}
    </div>
  )
}
