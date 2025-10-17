import appointmentsData from "@/services/mockData/appointments.json";
import doctorService from "@/services/api/doctorService";
import patientService from "@/services/api/patientService";
class AppointmentService {
  constructor() {
    this.appointments = [...appointmentsData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.appointments];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const appointment = this.appointments.find(a => a.Id === parseInt(id));
    if (!appointment) {
      throw new Error("Appointment not found");
    }
    return { ...appointment };
  }

  async create(appointmentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newAppointment = {
      ...appointmentData,
      Id: Math.max(...this.appointments.map(a => a.Id)) + 1,
      status: "scheduled",
      createdAt: new Date().toISOString()
    };
    this.appointments.push(newAppointment);
    return { ...newAppointment };
  }

  async update(id, appointmentData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = this.appointments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Appointment not found");
    }
    this.appointments[index] = { ...this.appointments[index], ...appointmentData };
    return { ...this.appointments[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = this.appointments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Appointment not found");
    }
    this.appointments.splice(index, 1);
    return true;
  }

  async getByDate(date) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.appointments.filter(appointment =>
      appointment.scheduledDate === date
    );
  }

  async getByPatient(patientId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.appointments.filter(appointment =>
      appointment.patientId === parseInt(patientId)
    );
  }

async getTodaysAppointments() {
    await new Promise(resolve => setTimeout(resolve, 200));
    const today = new Date().toISOString().split('T')[0];
    return this.appointments.filter(appointment =>
      appointment.scheduledDate === today
    );
  }

  async sendReminder(appointmentId, notificationType = 'patient') {
    const appointment = await this.getById(appointmentId);
    if (!appointment) {
      throw new Error('Appointment not found');
    }

    const patient = await patientService.getById(appointment.patientId);
    const doctor = await doctorService.getById(appointment.doctorId);

    if (!patient.email) {
      throw new Error('Patient email not found');
    }

    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    try {
      const result = await apperClient.functions.invoke(
        import.meta.env.VITE_SEND_APPOINTMENT_REMINDER,
        {
          body: JSON.stringify({
            appointmentId: appointment.Id,
            patientEmail: patient.email,
            patientName: patient.name,
            doctorName: doctor.name,
            appointmentDate: appointment.scheduledDate,
            appointmentTime: appointment.scheduledTime,
            notificationType: notificationType
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const responseData = await result.json();
      
      if (!responseData.success) {
        console.info(`apper_info: Got an error in this function: ${import.meta.env.VITE_SEND_APPOINTMENT_REMINDER}. The response body is: ${JSON.stringify(responseData)}.`);
        throw new Error(responseData.error || 'Failed to send reminder');
      }

      return responseData;
    } catch (error) {
      console.info(`apper_info: Got this error in this function: ${import.meta.env.VITE_SEND_APPOINTMENT_REMINDER}. The error is: ${error.message}`);
      throw error;
    }
  }

  getUpcomingReminders(hoursAhead = 24) {
    const now = new Date();
    const futureTime = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000);
    
    return this.appointments.filter(appointment => {
      if (appointment.status !== 'scheduled') return false;
      
      const appointmentDateTime = new Date(`${appointment.scheduledDate}T${appointment.scheduledTime}`);
      return appointmentDateTime > now && appointmentDateTime <= futureTime;
    });
  }
}

export default new AppointmentService();