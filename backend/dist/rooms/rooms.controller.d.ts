import { RoomsService } from './rooms.service';
import { Room } from './types';
export declare class RoomsController {
    private roomsService;
    constructor(roomsService: RoomsService);
    createRoom(ownerId: any): Promise<import("@nestjs/common").NotFoundException | import(".prisma/client").Room>;
    getOwnerRoom(ownerId: number): Promise<import(".prisma/client").Room>;
    endMeeting(roomId: Room['id']): Promise<void>;
    getRoomDetails(roomId: string): Promise<Room>;
    addMember(roomId: string, memberId: any): Promise<Room[]>;
}
