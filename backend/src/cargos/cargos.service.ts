// src/cargos/cargos.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CargosService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; descripcion?: string }) {
    return this.prisma.cargos.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.cargos.findMany();
  }

  async findOne(id: string) {
    return this.prisma.cargos.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: { name?: string; descripcion?: string }) {
    return this.prisma.cargos.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.cargos.delete({
      where: { id },
    });
  }
}
