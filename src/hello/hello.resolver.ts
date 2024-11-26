import { Query, Resolver } from '@nestjs/graphql';
import { HelloService } from 'src/hello/hello.service';

@Resolver()
export class HelloResolver {
  constructor(private readonly helloService: HelloService) {}

  @Query(() => String, { name: 'hello' })
  getHello(): string {
    return this.helloService.getHello();
  }
}
