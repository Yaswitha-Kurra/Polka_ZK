// In-memory storage (in production, use database)
let storage = {
  identities: {},
  orgs: {
    1: {
      orgId: 1,
      name: 'Engineering',
      description: 'Engineering team files',
      members: [],
      preApprovedAddresses: []
    },
    2: {
      orgId: 2,
      name: 'Finance',
      description: 'Finance team files',
      members: [],
      preApprovedAddresses: []
    },
    3: {
      orgId: 3,
      name: 'HR',
      description: 'HR team files',
      members: [],
      preApprovedAddresses: []
    }
  },
  files: {
    1: [
      { fileId: 1, name: 'tech-spec.pdf', size: 1024, type: 'application/pdf', content: 'Sample tech spec' },
      { fileId: 2, name: 'architecture.md', size: 2048, type: 'text/markdown', content: 'Sample architecture' }
    ],
    2: [
      { fileId: 1, name: 'budget-2024.xlsx', size: 4096, type: 'application/vnd.ms-excel', content: 'Sample budget' }
    ],
    3: [
      { fileId: 1, name: 'employee-handbook.pdf', size: 8192, type: 'application/pdf', content: 'Sample handbook' }
    ]
  },
  verifications: {}
};

export function initStorage() {
  console.log('Storage initialized');
}

export function getStorage() {
  return storage;
}

export function setStorage(newStorage) {
  storage = newStorage;
}

