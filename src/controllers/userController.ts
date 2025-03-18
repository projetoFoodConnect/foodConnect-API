import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
  const { nome, email, senha, telefone, endereco, perfilUsuario, nomeOrganizacao } = req.body;

  if (!email || !senha || !nome || !perfilUsuario || !telefone || !endereco || !nomeOrganizacao) {
    return res.status(400).json({ error: "Campos necessários do usuário são obrigatórios." });
  }

  try {
    const existingUser = await prisma.usuarios.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email já registrado' });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuarios.create({
      data: {
        nome,
        email,
        senha: hashedPassword,
        telefone,
        endereco,
        perfilUsuario,
        nomeOrganizacao,
        dataCadastro: new Date(),
        status: "ATIVO"
      }
    });

    const token = jwt.sign(
      { idUsuario: usuario.idUsuario, email: usuario.email, perfilUsuario: usuario.perfilUsuario },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" }
    );

    return res.status(201).json({ usuario, token });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    return res.status(500).json({ message: 'Erro ao cadastrar usuário', error });
  }
};