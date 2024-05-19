import {RoutesParams} from '@type/routes';
import pLimit from 'p-limit';

const limit = pLimit(100);

export const parseUsersCsv = async ({event, services}: RoutesParams) => {
  const {logger, fileParser, users} = services;
  const fileDataList = await fileParser.parseCSVToJSON(event);
  logger.debug('file data', fileDataList);
  const usersResp = await Promise.allSettled(fileDataList.map(user => {
    return limit(() => users.insert({
      additional_info: {
        gender: user?.gender,
      },
      address: {
        line1: user?.address?.line1,
        line2: user?.address?.line2,
        city: user?.address?.city,
        state: user?.address?.state,
      },
      age: Number(user?.age || '0'),
      name: `${user?.name?.firstName} ${user?.name?.lastName || ''}`,
    }));
  }));

  const rejectedMessage = usersResp.filter(urep => urep.status === 'rejected');
  if (rejectedMessage.length) {
    return rejectedMessage;
  }

  return users.ageGroupDistribution();
};

export const ageGroupDistribution = async ({services: {users}}: RoutesParams) => {
  return users.ageGroupDistribution();
};
