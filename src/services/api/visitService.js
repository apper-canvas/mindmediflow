import visitsData from "@/services/mockData/visits.json";

class VisitService {
  constructor() {
    this.visits = [...visitsData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.visits];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const visit = this.visits.find(v => v.Id === parseInt(id));
    if (!visit) {
      throw new Error("Visit not found");
    }
    return { ...visit };
  }

  async create(visitData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newVisit = {
      ...visitData,
      Id: Math.max(...this.visits.map(v => v.Id)) + 1,
      visitDate: new Date().toISOString().split('T')[0],
      checkInTime: new Date().toTimeString().slice(0, 5)
    };
    this.visits.push(newVisit);
    return { ...newVisit };
  }

  async update(id, visitData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = this.visits.findIndex(v => v.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Visit not found");
    }
    this.visits[index] = { ...this.visits[index], ...visitData };
    return { ...this.visits[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = this.visits.findIndex(v => v.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Visit not found");
    }
    this.visits.splice(index, 1);
    return true;
  }

  async getByPatient(patientId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.visits.filter(visit =>
      visit.patientId === parseInt(patientId)
    ).sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));
  }

  async checkOut(id, checkOutData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.visits.findIndex(v => v.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Visit not found");
    }
    this.visits[index] = { 
      ...this.visits[index], 
      ...checkOutData, 
      checkOutTime: new Date().toTimeString().slice(0, 5)
    };
    return { ...this.visits[index] };
  }
}

export default new VisitService();