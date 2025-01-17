import { Body, HttpException, Inject, Post, UseGuards } from '@nestjs/common'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { Repository } from 'typeorm'
import { Course } from '../../models/postgres/course.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { UUID_GEN_NATIVE } from 'src/core/infraestructure/UUID/module/UUID.module'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { ApiHeader } from '@nestjs/swagger'
import { COURSE_ROUTE_PREFIX } from '../prefix'
import { COURSE_DOC_PREFIX } from '../prefix'
import { CreateCourseDTO } from './dto/create-course.dto'

@Controller({
    path: COURSE_ROUTE_PREFIX,
    docTitle: COURSE_DOC_PREFIX,
})
export class CreateCourseController
    implements
        ControllerContract<
            [body: CreateCourseDTO],
            {
                id: string
            }
        >
{
    constructor(
        @Inject(UUID_GEN_NATIVE) private idGen: IDGenerator<string>,
        @InjectRepository(Course) private courseRepo: Repository<Course>,
    ) {}

    @Post('create')
    @ApiHeader({
        name: 'auth',
    })
    @Roles('ADMIN')
    @UseGuards(UserGuard, RolesGuard)
    @ApiHeader({
        name: 'auth',
    })
    async execute(@Body() body: CreateCourseDTO): Promise<{ id: string }> {
        const possibleCourse = await this.courseRepo.findOneBy({
            title: body.title,
        })
        if (possibleCourse) throw new HttpException('Wrong credentials', 400)
        const courseId = this.idGen.generate()
        const creationDate = new Date()
        await this.courseRepo.save({
            id: courseId,
            createDate: creationDate,
            ...body,
        })
        return {
            id: courseId,
        }
    }
}
