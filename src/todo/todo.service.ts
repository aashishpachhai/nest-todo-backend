import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectModel } from 'nest-knexjs';
import { Knex } from 'knex';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
@Injectable()
export class TodoService {
  constructor(@InjectModel() private readonly knex: Knex) {}
  async create(createTodoDto: CreateTodoDto) {
    try {
      const todo = await this.knex.table('todo_table').insert({
        title: createTodoDto.title,
        description: createTodoDto.description,
      });
      return { todo };
    } catch (err) {
      throw new NotFoundException(err);
    }
  }

  findAll() {
    return this.knex.table('todo_table');
  }

  findOne(id: number) {
    return this.knex.table('todo_table').where('id', id);
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    return this.knex
      .table('todo_table')
      .where('id', id)
      .update({
        title: updateTodoDto.title,
        description: updateTodoDto.description,
      })
      .then(() => this.findOne(id));
  }

  async remove(id: number) {
    if (!id) {
      throw new NotFoundException(`User ${id} doesn't exist`);
    }
    const del = await this.knex.table('todo_table').where('id', id).del();
    return { del };
  }
}
