import { TypeOrmModule } from '@nestjs/typeorm'
import { Video } from 'src/video/infraestructure/models/postgres/video'

export const VideoModel = TypeOrmModule.forFeature([Video])
