import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const registerUser = async (req: Request, res: Response) => {
  const { nome, email, senha, telefone, endereco, perfilUsuario, nomeOrganizacao } = req.body;

  if (!email || !senha || !nome || !perfilUsuario || !telefone || !endereco || !nomeOrganizacao) {
    return res.status(400).json({ error: "Campos necessários do usuário são obrigatórios." });
  }

  try {
    const existingUser = await prisma.usuarios.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.status === "ATIVO") {
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
        lastLogin: new Date(),
        status: "ATIVO"
      }
    });

    const token = jwt.sign(
      { userId: usuario.idUsuario, email: usuario.email, perfil: usuario.perfilUsuario },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" }
    );


    return res.status(201).json({ usuario, token });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    return res.status(500).json({ message: 'Erro ao cadastrar usuário', error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  try {
    const usuario = await prisma.usuarios.findUnique({
      where: { email },
    });

    if (!usuario || usuario.status !== "ATIVO") {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(senha, usuario.senha);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    const token = jwt.sign(
      { userId: usuario.idUsuario, email: usuario.email, perfil: usuario.perfilUsuario },
      process.env.JWT_SECRET!,
      { expiresIn: '2h' }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, // Expira em 24 horas
    });

    const updateLogin = await prisma.usuarios.update({
      where: { idUsuario: usuario.idUsuario },
      data: {
        lastLogin: new Date(),
      },
    });

    return res.json({
      message: "Login bem-sucedido!",
      user: {
        id: usuario.idUsuario,
        nameUser: usuario.nome,
        email: usuario.email,
        lastLogin: updateLogin.lastLogin
      },
    });

  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login', error });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout realizado com sucesso!" });
};

export const getUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const idUsuario = (req.user as JwtPayload)?.userId;

  if (!idUsuario) {
    res.status(401).json({ message: "Usuário não autenticado." });
    return;
  }

  const usuario = await prisma.usuarios.findUnique({
    where: { idUsuario },
    select: {
      idUsuario: true,
      nome: true,
      email: true,
      telefone: true,
      endereco: true,
      perfilUsuario: true,
      nomeOrganizacao: true,
      dataCadastro: true,
      lastLogin: true,
      status: true,
    },
  });

  if (!usuario) {
    res.status(404).json({ message: "Usuário não encontrado." });
    return;
  }

  res.status(200).json({ usuario });
};

export const updateUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const idUsuario = (req.user as JwtPayload)?.userId;
  const { nome, email, senha, telefone, endereco, nomeOrganizacao } = req.body;

  const usuario = await prisma.usuarios.findUnique({
    where: { idUsuario },
  });

  if (!usuario) {
    res.status(401).json({ message: "Usuário não autenticado." });
    return;
  }

  try {
    const usuarioAtualizado = await prisma.usuarios.update({
      where: { idUsuario },
      data: {
        nome: nome || usuario.nome,
        email: email || usuario.email,
        senha: senha ? await bcrypt.hash(senha, 10) : usuario.senha,
        telefone: telefone || usuario.telefone,
        endereco: endereco || usuario.endereco,
        nomeOrganizacao: nomeOrganizacao || usuario.nomeOrganizacao,
      },
    });

    const { senha: _, ...usuarioSemSenha } = usuarioAtualizado;

    res.status(200).json({ message: "Usuário atualizado com sucesso!", usuarioSemSenha });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ message: 'Erro ao atualizar usuário', error });
  }
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const idUsuario = (req.user as JwtPayload)?.userId;

  if (!idUsuario) {
    res.status(401).json({ message: "Usuário não autenticado." });
    return;
  }

  try {
    await prisma.usuarios.update({
      where: { idUsuario },
      data: { status: "INATIVO" },
    });

    res.status(200).json({ message: "Usuário deletado com sucesso!" });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ message: 'Erro ao deletar usuário', error });
  }
}